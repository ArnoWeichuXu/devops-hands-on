terraform {
  backend "s3" {
    encrypt = true
    bucket = "terraform-remote-state-storage-s3-arno"
    region = "ap-southeast-2"
    key = "./terraform.tfstate"
    profile = "default"
  }
}
