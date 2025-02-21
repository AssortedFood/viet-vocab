#!/bin/bash

# Print the project structure excluding node_modules and .next
echo "Project Structure:"
tree -I "node_modules|.next"

echo -e "\n\nConcatenating all .js files:\n"

# Find and display contents of all .js files (excluding node_modules and .next)
find . -type f -name "*.js" ! -path "*/node_modules/*" ! -path "*/.next/*" -exec echo -e "\n==== {} ====\n" \; -exec cat {} \;
