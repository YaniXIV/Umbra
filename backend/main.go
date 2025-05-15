
package main
import (
	"Umbra/backend/globals"
	"Umbra/backend/goleo"
	"Umbra/backend/server"
	"fmt"
	"log"
	"os"
	"strings"
  "bufio"
)


func foo(){

  err := globals.InitVariables()
  if err != nil{
    log.Fatal("Error loading variables from .env ", err)
  }

  fmt.Println("Server Started!")

  server.InitServer()
}

func main(){
  err := globals.InitVariables()
  if err != nil{
    panic(err)
  }

  	lp, err := goleo.InitFromCircuitWithOptions(goleo.InitOptions{
		ProjectName: "geoproof",
		LeoBin:      "leo",
		CircuitPath: "../geoproof/src/main.leo",
	})
  dir, _ :=os.Getwd() 
  fmt.Println("current working directory: ", dir)
	if err != nil {
		log.Println(err)
	}
	//buildErr := lp.Build()
  //log.Println("build failed :", err)
	//if buildErr != nil {
	//}

	out, runErr := lp.Run("main", "3i32", "3i32", "12i32", "13i32", "400i32")
	if runErr != nil {
  log.Println("failed to run", out, runErr)
	}
  scanner := bufio.NewScanner(strings.NewReader(out))
  x := true
  for scanner.Scan(){
    line := strings.TrimSpace(scanner.Text())
    if strings.HasSuffix(line, "true"){
      fmt.Println("output is True!")
      x = false
    }else if strings.HasSuffix(line, "false"){
      fmt.Println("output is false")
      x = false
    }
  }
    if x{
      fmt.Println("could not find output!!!!!!")
    }

	fmt.Println(out)
}
