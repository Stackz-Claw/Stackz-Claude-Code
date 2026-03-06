# Photo Organization Reference

## Strategy: EXIF First, Filesystem Date as Fallback

Photos have two dates: when they were *taken* (EXIF) and when the *file was modified* (filesystem). Always prefer EXIF — filesystem dates change on copy/transfer.

---

## Check What's Available

```bash
# Check if exiftool is installed (best option)
which exiftool

# macOS alternative (no extra install needed)
mdls -name kMDItemContentCreationDate photo.jpg

# ImageMagick fallback
identify -verbose photo.jpg | grep "date:"
```

If none are available, fall back to file modification date and note it in the summary.

---

## Extract EXIF Date

```bash
# Single file
exiftool -DateTimeOriginal -d "%Y-%m-%d" photo.jpg

# Batch — output filename and date
exiftool -DateTimeOriginal -d "%Y %m" -T -r "$PHOTOS_DIR" 2>/dev/null
```

---

## Sorting Script (bash)

```bash
#!/bin/bash
# Sorts photos into YYYY/MM-MonthName/ structure
# Usage: ./sort-photos.sh /path/to/photos /path/to/output

SOURCE="$1"
DEST="$2"
UNSORTED="$DEST/Unsorted"

declare -A MONTHS=(
  ["01"]="01-January" ["02"]="02-February" ["03"]="03-March"
  ["04"]="04-April"   ["05"]="05-May"       ["06"]="06-June"
  ["07"]="07-July"    ["08"]="08-August"    ["09"]="09-September"
  ["10"]="10-October" ["11"]="11-November"  ["12"]="12-December"
)

mkdir -p "$UNSORTED"

find "$SOURCE" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
  -o -iname "*.heic" -o -iname "*.gif" -o -iname "*.mov" -o -iname "*.mp4" \) | \
while read -r file; do
  # Try EXIF date first
  date_str=$(exiftool -DateTimeOriginal -d "%Y %m" -T "$file" 2>/dev/null | tr -d '[:space:]')
  
  if [[ -z "$date_str" || "$date_str" == "-" ]]; then
    # Fall back to file modification date
    if [[ "$(uname -s)" == "Darwin" ]]; then
      date_str=$(stat -f "%Sm" -t "%Y %m" "$file")
    else
      date_str=$(stat -c "%y" "$file" | cut -d' ' -f1 | awk -F'-' '{print $1" "$2}')
    fi
    fallback=true
  fi

  year=$(echo "$date_str" | awk '{print $1}')
  month=$(echo "$date_str" | awk '{print $2}')
  month_dir="${MONTHS[$month]:-$month}"

  if [[ -n "$year" && -n "$month" ]]; then
    target_dir="$DEST/$year/$month_dir"
    mkdir -p "$target_dir"
    
    # Handle filename conflicts
    filename=$(basename "$file")
    target="$target_dir/$filename"
    if [[ -f "$target" ]]; then
      base="${filename%.*}"
      ext="${filename##*.}"
      target="$target_dir/${base}-$(date +%s).${ext}"
    fi
    
    mv -v "$file" "$target"
    [[ "$fallback" == true ]] && echo "WARN: Used filesystem date for: $filename"
  else
    mv -v "$file" "$UNSORTED/"
    echo "WARN: No date found, moved to Unsorted: $(basename "$file")"
  fi
done
```

---

## Target Structure

```
Photos/
├── 2022/
│   ├── 01-January/
│   ├── 06-June/
│   └── 12-December/
├── 2023/
│   └── ...
├── 2024/
│   └── ...
└── Unsorted/          ← No date found; needs manual review
```

---

## After Sorting

- Review `Unsorted/` — screenshots, downloads, and graphics often land here
- Duplicates: photos from cloud sync often appear twice; run duplicate check after sorting
- Video files: use same date logic — `exiftool -CreateDate` for `.mov`/`.mp4`
- Live Photos (iOS): `.jpg` and `.mov` pairs — keep together, both will be sorted to same folder
