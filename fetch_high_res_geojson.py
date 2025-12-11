import requests
import json
import os

# URL for South Korea municipalities GeoJSON (Kostat 2018)
# This source is more accurate for Korean administrative boundaries
URL = "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-municipalities-2018-geo.json"

OUTPUT_PATH = r"c:\Users\kang\Desktop\디자인진흥원\frontend\public\busan_districts_high.json"

def download_and_filter_geojson():
    try:
        print(f"Downloading GeoJSON from {URL}...")
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
        
        print("Download successful. Filtering for Busan (Code starts with 21)...")
        
        busan_features = []
        found_names = set()

        for feature in data['features']:
            props = feature['properties']
            
            # Kostat standard: 'name' is Korean name, 'code' is 5 digit SIG_CD
            # e.g. name: '종로구', code: '11110'
            name = props.get('name')
            code = props.get('code')
            
            # Fallback for different key names just in case
            if not code:
                 code = props.get('SIG_CD')
                 name = props.get('SIG_KOR_NM')

            if code and str(code).startswith('21'):
                # Standardize properties for frontend
                # We retain 'code' and 'name'
                feature['properties'] = {
                    'code': str(code),
                    'name': name
                }
                
                busan_features.append(feature)
                found_names.add(f"{name}({code})")

        print(f"Found {len(busan_features)} features for Busan.")
        print(f"Districts: {sorted(list(found_names))}")

        # Check if we have 16 districts
        if len(busan_features) != 16:
            print("Warning: Expected 16 districts in Busan. Found:", len(busan_features))
        
        # Generate GeoJSON
        new_geojson = {
            "type": "FeatureCollection",
            "features": busan_features
        }
        
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(new_geojson, f, ensure_ascii=False)
            
        print(f"Successfully saved to {OUTPUT_PATH}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    download_and_filter_geojson()
