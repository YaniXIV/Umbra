package globals

import(
  "github.com/joho/godotenv"
  "os"
)

var PORT string

func InitVariables()error{
  err := godotenv.Load()
  if err != nil{
    return err
  }
  
  PORT = os.Getenv("PORT")
  if PORT == ""{
    return err 

  }
  return nil
}
