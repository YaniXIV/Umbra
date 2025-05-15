package goleo

import (
	"fmt"
	"log"
	"testing"
)

func TestInit(t *testing.T) {
	lp, err := InitFromCircuitWithOptions(InitOptions{
		ProjectName: "geoproof",
		LeoBin:      "leo",
		CircuitPath: "./GeoProof/src/main.leo",
	})
	if err != nil {
		panic(err)
	}
	buildErr := lp.Build()
	if buildErr != nil {
		log.Println("build failed :", err)
	}

	out, runErr := lp.Run("3u32", "3u32", "12u32", "13u32", "50u32")
	if runErr != nil {
		log.Println("failed to run", out, runErr)
	}
	fmt.Println(out)
}
