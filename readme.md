## Node File Manager

This is a simple file manager that allows you to create, read, update, and delete files.

## Usage

### Prerequisites
- Node.js (v14 or higher recommended)

### Getting Started
1. Clone the repository or download the source code.
2. Open a terminal in the project directory.
3. Run the file manager with:

    node index.js --username=YourName

   Replace `YourName` with your preferred username. If omitted, it defaults to "Someone".

### Available Commands
- `up` — Go up one directory level
- `cd <path>` — Change directory to `<path>` (absolute or relative)
- `ls` — List files and directories in the current directory
- `cat <file>` — Display the contents of `<file>`
- `add <file>` — Create a new empty file named `<file>` in the current directory
- `rm <file>` — Remove the specified `<file>`
- `mkdir <dirname>` — Create a new directory named `<dirname>`
- `.exit` — Exit the file manager

### Example Session
```
node index.js --username=Alice
Welcome to the File Manager, Alice!
You are currently in /Users/alice
> ls
> mkdir test
> cd test
> add hello.txt
> ls
> cat hello.txt
> up
> .exit
```

### Notes
- All commands are case-sensitive.
- The current directory is shown after each command.
- Errors or invalid commands will display "Operation failed" or "Invalid input".
