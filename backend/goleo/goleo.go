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
		bin = "Leo"
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
		Path:        projectPath,
		Name:        name,
		LeoBin:      bin,
		CircuitPath: opts.CircuitPath,
	}
	srcPath := filepath.Join(projectPath, "src", "main.leo")
	if err = overwriteCircuit(&lp, srcPath); err != nil {
		cleanUpErr := os.RemoveAll(tmpDir)
		if cleanUpErr != nil {
			return nil, fmt.Errorf("failed to write circuit: %v; Also failed to clean up temp dir %v", err, cleanUpErr)
		}
		return nil, fmt.Errorf("failed to write circuit: %w", err)
	}
	return &lp, nil
}

func Cleanup(lp *LeoProject) error {
	err := os.RemoveAll(lp.Name)
	if err != nil {
		return err
	}
	log.Print("Tmp files cleaned up successfully")
	return nil
}
