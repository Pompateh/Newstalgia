import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
import os
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
import numpy as np

def read_file(file_path):
    file_extension = os.path.splitext(file_path)[1].lower()
    if file_extension == '.xlsx':
        return pd.read_excel(file_path)
    elif file_extension == '.csv':
        return pd.read_csv(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def process_files(bulk_file_path, specific_file_path):
    try:
        # --- 1. READ THE BULK FILE ---
        sheet_name = "Sponsored Products Campaigns"
        df_bulk = pd.read_excel(bulk_file_path, sheet_name=sheet_name)

        # A. Normalize columns
        df_bulk.columns = [col.strip().lower() for col in df_bulk.columns]
        print("Columns in bulk file:", df_bulk.columns.tolist())

        # B. Remove potential total rows (if any) where ASIN might say "total"
        #    This helps avoid rows that have aggregated data for all ASINs.
        df_bulk = df_bulk[~df_bulk['asin'].astype(str).str.contains('total', case=False, na=False)]

        # C. Ensure required columns
        required_bulk_columns = ['asin', 'impressions', 'clicks', 'spend', 'sales', 'units', 'daily budget']
        for col in required_bulk_columns:
            if col not in df_bulk.columns:
                # Try to find a possible match if the column name is slightly different
                possible_matches = [c for c in df_bulk.columns if col in c]
                if possible_matches:
                    df_bulk[col] = df_bulk[possible_matches[0]]
                else:
                    raise ValueError(f"Column '{col}' is missing from the bulk file")

        # D. Clean "daily budget" column
        # Remove currency symbols and commas
        df_bulk['daily budget'] = df_bulk['daily budget'].replace('[\\$,€,]', '', regex=True)
        # Convert to numeric
        df_bulk['daily budget'] = pd.to_numeric(df_bulk['daily budget'], errors='coerce')
        # Forward-fill to handle merged cells
        df_bulk['daily budget'] = df_bulk['daily budget'].ffill()

        # E. Convert other numeric columns
        numeric_columns = ['impressions', 'clicks', 'spend', 'sales', 'units']
        for col in numeric_columns:
            df_bulk[col] = pd.to_numeric(df_bulk[col], errors='coerce')

        # F. Drop rows missing critical data (asin, impressions, etc.)
        critical_columns = ['asin', 'impressions', 'clicks', 'spend', 'sales', 'units']
        df_bulk = df_bulk.dropna(subset=critical_columns)

        # Fill any remaining NaN daily budget with 0 if truly missing
        df_bulk['daily budget'] = df_bulk['daily budget'].fillna(0)

        # --- 2. AGGREGATE THE BULK FILE ---
        #    We take the 'first' daily budget, assuming it's consistent per ASIN.
        #    We sum up the rest.
        def count_non_zero_budget(series):
            non_zero_count = (series != 0).sum()
            if non_zero_count == 0:
                print(f"Warning: ASIN with all zero daily budgets: {series.name}")
            return non_zero_count

        agg_dict_bulk = {
            'daily budget': count_non_zero_budget,  # Count non-zero budget entries
            'impressions': 'sum',
            'clicks': 'sum',
            'spend': 'sum',
            'sales': 'sum',
            'units': 'sum'
        }

        df_agg_bulk = df_bulk.groupby('asin').agg(agg_dict_bulk).reset_index()
        
        print("Aggregated bulk data (sample):")
        print(df_agg_bulk.head())

        # Add debugging information
        print("\nUnique daily budget counts:")
        print(df_agg_bulk['daily budget'].value_counts())
        
        print("\nSample of ASINs with daily budget count of 0:")
        print(df_agg_bulk[df_agg_bulk['daily budget'] == 0][['asin', 'daily budget']].head())

        # --- 3. PROCESS THE SPECIFIC (SALES) FILE ---
        df_specific = read_file(specific_file_path)
        df_specific.columns = [col.strip().lower() for col in df_specific.columns]

        required_columns = ['asin', 'purchased', 'revenue', 'royalties']
        for col in required_columns:
            if col not in df_specific.columns:
                df_specific[col] = 0

        agg_dict_specific = {
            'purchased': 'sum',
            'revenue': 'sum',
            'royalties': 'sum'
        }
        df_agg_specific = df_specific.groupby('asin', as_index=False).agg(agg_dict_specific)

        # --- 4. MERGE THE DATA ---
        # Left join so that we keep all ASINs from df_agg_specific and match bulk data if it exists
        final_df = pd.merge(df_agg_specific, df_agg_bulk, on='asin', how='left')

        # --- 5. DERIVED METRICS ---
        final_df['click-through rate'] = (final_df['clicks'] / final_df['impressions']) * 100
        final_df['price per click'] = final_df['spend'] / final_df['clicks']
        final_df['spend conversion'] = final_df['spend'] / final_df['sales']
        final_df['% of purchased (ads)'] = (final_df['units'] / final_df['purchased']) * 100

        # Handle potential division by zero
        final_df['click-through rate'] = final_df['click-through rate'].fillna(0).replace([np.inf, -np.inf], 0)
        final_df['price per click'] = final_df['price per click'].fillna(0).replace([np.inf, -np.inf], 0)
        final_df['spend conversion'] = final_df['spend conversion'].fillna(0).replace([np.inf, -np.inf], 0)
        final_df['% of purchased (ads)'] = final_df['% of purchased (ads)'].fillna(0).replace([np.inf, -np.inf], 0)

        # --- 6. FORMAT & SAVE ---
        desired_columns = [
            'asin',
            'daily budget',
            'impressions',
            'clicks',
            'click-through rate',
            'price per click',
            'spend',
            'sales',
            'units',
            'spend conversion',
            '% of purchased (ads)',
            'purchased',
            'revenue',
            'royalties'
        ]
        final_df = final_df.reindex(columns=desired_columns)

        # Fill NaN with 0 for numeric columns
        num_cols = desired_columns[1:]
        final_df[num_cols] = final_df[num_cols].fillna(0)

        # Sort and round
        final_df = final_df.sort_values(by='asin')
        final_df[num_cols] = final_df[num_cols].round(2)

        # Prompt user to save
        output_file = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx")],
            title="Save merged data as..."
        )
        if output_file:
            wb = Workbook()
            ws = wb.active
            ws.title = "Merged Data"
            for r in dataframe_to_rows(final_df, index=False, header=True):
                ws.append(r)
            wb.save(output_file)
            messagebox.showinfo("Success", f"Data processed and saved successfully. {len(final_df)} rows processed.")

    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")

def select_files():
    bulk_file_path = filedialog.askopenfilename(
        filetypes=[("Excel files", "*.xlsx")],
        title="Select bulk Excel file"
    )
    if not bulk_file_path:
        return

    specific_file_path = filedialog.askopenfilename(
        filetypes=[("Excel files", "*.xlsx"), ("CSV files", "*.csv")],
        title="Select specific ASIN file (Excel or CSV)"
    )
    if not specific_file_path:
        return

    process_files(bulk_file_path, specific_file_path)

# Create the main Tkinter window
if __name__ == "__main__":
    root = tk.Tk()
    root.title("Amazon Data Merger")
    root.geometry("400x200")
    label = tk.Label(root, text="Click the button to select files for processing:")
    label.pack(pady=20)
    button = tk.Button(root, text="Select Files", command=select_files)
    button.pack(pady=10)
    root.mainloop()
