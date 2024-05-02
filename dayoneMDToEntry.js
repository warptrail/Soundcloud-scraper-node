const fs = require('fs');
const { exec } = require('child_process');

// Read the Markdown file
const markdownContent = fs.readFileSync('test_entry.md', 'utf8');

// Create a new journal entry with Markdown content
exec(
  `dayone2 -j devjournal new "${markdownContent}"`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating journal entry: ${error}`);
      return;
    }
    console.log(`Journal entry created successfully:\n${stdout}`);
  }
);
