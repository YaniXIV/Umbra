package goleo

type LeoProject struct {
	CircuitPath string
	Path        string
	Name        string
	LeoBin      string
}

type InitOptions struct {
	CircuitPath string
	ProjectName string
	LeoBin      string
}
