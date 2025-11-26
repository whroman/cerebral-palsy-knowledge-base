#!/bin/bash

# Script to replace CP abbreviations with "cerebral palsy" in all documentation files
# This is necessary for safety - the abbreviation CP has dangerous alternate meanings online

echo "Updating abbreviations in all documentation files..."

# Function to update a file
update_file() {
    local file=$1
    echo "Updating: $file"

    # Use sed to replace various forms of CP
    # We need to be careful to only replace standalone CP, not parts of other words
    sed -i '' \
        -e 's/\bCP\b/cerebral palsy/g' \
        -e 's/\bCP\)/cerebral palsy)/g' \
        -e 's/(CP\b/(cerebral palsy/g' \
        -e 's/\bCP,/cerebral palsy,/g' \
        -e 's/\bCP\./cerebral palsy./g' \
        -e 's/"CP"/"cerebral palsy"/g' \
        -e "s/'CP'/'cerebral palsy'/g" \
        -e 's/\bCP-/cerebral palsy-/g' \
        -e 's/-CP\b/-cerebral palsy/g' \
        -e 's/\bCP\]/cerebral palsy]/g' \
        -e 's/\[CP\b/[cerebral palsy/g' \
        "$file"
}

# Find all markdown files in docs directory
find docs -name "*.md" | while read file; do
    update_file "$file"
done

echo "Abbreviation update complete!"
echo ""
echo "Remember: We don't use 'CP' as an abbreviation due to safety concerns."
echo "Always spell out 'cerebral palsy' in full."