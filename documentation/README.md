# Documentation

This is a general documentation for EECS 448 Battleship game.

This guide contains information on getting the development and production server
up, as well as information about tools used in the process of development and
works cited.

## Time Estimate

[Time estimate](time-estimate.md) and
[actual accounting of time taken](time-accounting.md).

## Development

Clone this repository

```zsh
git clone https://github.com/maxxxxxdlp/eecs-448-project-2
```

A makefile must be used to make the program.

```zsh
# Navigate to the source directory
cd eecs-448-project-1

# Build the program
make

# Run the executable
./Battleship

# Clean up
make clean
```

### (Optional) Pre-commit hooks

This project uses pre-commit.com hooks, which run code linters and validators
before every commit. Instructions for configuring pre-commit hooks can be found
in [.pre-commit-config.yaml](../.pre-commit-config.yaml)

Besides, pre-commit, you would need to install development dependencies for all
hooks to work properly:

```zsh
npm i  # install development dependencies
```

## Documentation Generation

```
NEED TO ADD DOCUMENTATION GENERATION INSTRUCTIONS
```

## Works Cited

- Bloomfield, Aaron. “PDR: Doxygen Tutorial.” PDR: Doxygen Tutorial,
  www.aaronbloomfield.github.io/pdr/tutorials/11-doxygen/index.html.
- “Fine-Tuning the Output.” Doxygen Manual: Doxygen Usage,
  www.doxygen.nl/manual/doxygen_usage.html.

## Tech stack

- C++
- Makefile

## Tools Used

Tools used in the process of development

- Git
- pre-commit.com
- GitHub
- Vim
- PyCharm
- Visual Studio CODE

## Licence

This code is available under MIT Licence
