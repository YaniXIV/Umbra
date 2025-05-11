package goleo

import (
	"io"
	"os"
)

func overwriteCircuit(lp *LeoProject, srcPath string) error {
	sourceFile, err := os.Open(lp.Path)
	if err != nil {
		return err
	}
	defer func(sourceFile *os.File) {
		closeErr := sourceFile.Close()
		if closeErr != nil {

		}
	}(sourceFile)
	destinationFile, err := os.Open(srcPath)
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
