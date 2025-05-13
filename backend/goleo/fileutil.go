package goleo

import (
	"io"
	"os"
	"path/filepath"
)

func (lp *LeoProject) overwriteCircuit() error {
	sourceFile, err := os.Open(lp.CircuitPath)
	if err != nil {
		return err
	}
	defer func(sourceFile *os.File) {
		closeErr := sourceFile.Close()
		if closeErr != nil {

		}
	}(sourceFile)
	destPath := filepath.Join(lp.ProjectPath, "src", "main.leo")
	destinationFile, err := os.OpenFile(destPath, os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer func(destinationFile *os.File) {
		closeErr := destinationFile.Close()
		if closeErr != nil {

		}
	}(destinationFile)

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return err
	}
	return nil
}
