package goleo

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func InitFromCircuit(pathToMainLeo string) (*LeoProject, error) {
	return InitFromCircuitWithOptions(
		InitOptions{
			CircuitPath: pathToMainLeo,
		})
}

func InitFromCircuitWithOptions(opts InitOptions) (*LeoProject, error) {
	name := opts.ProjectName
	if name == "" {
		name = "LeoProject"
	}
	bin := opts.LeoBin
	if bin == "" {
		bin = "leo"
	}

	tmpDir, err := os.MkdirTemp("", "leo-*")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory: %w", err)
	}
	cmd := exec.Command(bin, "new", name)
	cmd.Dir = tmpDir
	if err = cmd.Run(); err != nil {

		cleanUpErr := os.RemoveAll(tmpDir)
		if cleanUpErr != nil {
			return nil, fmt.Errorf("command failed: %v; Also failed to clean up temp dir %v", err, cleanUpErr)
		}
		return nil, fmt.Errorf("failed to run 'leo new %s': %w", name, err)
	}
	projectPath := filepath.Join(tmpDir, name)
	lp := LeoProject{
		ProjectPath: projectPath,
		Name:        name,
		LeoBin:      bin,
		CircuitPath: opts.CircuitPath,
	}
	if err = lp.overwriteCircuit(); err != nil {
		cleanUpErr := os.RemoveAll(tmpDir)
		if cleanUpErr != nil {
			return nil, fmt.Errorf("failed to write circuit: %v; Also failed to clean up temp dir %v", err, cleanUpErr)
		}
		return nil, fmt.Errorf("failed to write circuit: %w", err)
	}
	return &lp, nil
}

// Cleanup logic to get rid of tmp directories and files,
func (lp *LeoProject) Cleanup() error {
	//Avoid panic
	if lp == nil {
		return nil
	}
	err := os.RemoveAll(lp.Name)
	if err != nil {
		return err
	}
	log.Print("Tmp files cleaned up successfully")
	return nil
}
