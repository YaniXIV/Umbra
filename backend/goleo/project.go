package goleo

import (
	"bufio"
	"fmt"
	"log"
	"strings"
)

func ParseOutput(output string) (bool, error) {
	scanner := bufio.NewScanner(strings.NewReader(output))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasSuffix(line, "true") {
			log.Println("output is true")
			return true, nil
		} else if strings.HasSuffix(line, "false") {
			log.Println("output is false")
			return false, nil
		}

	}
	return false, fmt.Errorf("could not parse result from output")
}
