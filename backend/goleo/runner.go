package goleo

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
)

type args interface {
}

func (lp *LeoProject) Build() error {
	cmd := exec.Command(lp.LeoBin, "build")
	cmd.Dir = lp.ProjectPath
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("build failed: %s\n%s", err, out)
	}
	return nil
}

func (lp *LeoProject) Run(args ...string) (string, error) {
	cmd := exec.Command(lp.LeoBin, args...)
	foo := os.Stdout
	fmt.Println(foo)
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		return "", err
	}

	buf := make([]byte, 256)
	bytes.NewBuffer(buf)

	_, err = foo.Read(buf)
	return string(buf), nil

}
