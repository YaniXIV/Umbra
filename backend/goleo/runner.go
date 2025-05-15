package goleo
import (

	"fmt"
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

func (lp *LeoProject) Run(args ...string)(string, error){

  fmt.Println("Running Command: ", lp.LeoBin, append([]string{"run"},args...))
	cmd := exec.Command(lp.LeoBin, append([]string{"run"},args...)...)
  cmd.Dir = lp.ProjectPath
  fmt.Println("Running in: ",cmd.Dir)
  out, err := cmd.CombinedOutput()
  if err != nil{
    return "", fmt.Errorf("run failed: %s\n%s",err, out)
  }
  return string(out), nil
}
