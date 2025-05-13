package goleo

type LeoProject struct {
	CircuitPath string
	ProjectPath string
	Name        string
	LeoBin      string
}

type InitOptions struct {
	CircuitPath string
	ProjectName string
	LeoBin      string
}
