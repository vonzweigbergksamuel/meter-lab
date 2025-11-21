#############################
# Google Project Variables
#############################
variable "project_id" {
  description = "The id of the project"
  type = string
  default = ""
}

variable "region" {
  description = "The region of the project"
  type = string
  default = ""
}

variable "project_number" {
  description = "The number of the project"
  type = string
  default = ""
}

#############################
# Project Variables
#############################
variable "project_name" {
  description = "The name of the project"
  type = string
  default = ""
}

#############################
# GitHub Variables
#############################
variable "github_app_installation_id" {
  description = "The installation id of the GitHub app"
  type = string
  default = ""
}

variable "github_token" {
  description = "The token of the GitHub app"
  type = string
  sensitive = true
  default = ""
}

variable "github_repo" {
  description = "The repository of the GitHub app"
  type = string
  default = ""
}