package main

import(
  "fmt"
  "Umbra/backend/server"
  "Umbra/backend/globals"
  "log"
)


func main(){

  err := globals.InitVariables()
  if err != nil{
    log.Fatal("Error loading variables from .env ", err)
  }

  fmt.Println("Server Started!")

  server.InitServer()
}

