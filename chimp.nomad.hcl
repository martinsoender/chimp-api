job "chimp" {
  datacenters = ["fra1"]
  type = "service"

  constraint {
    attribute = "${node.class}"
    value = "standard"
  }

  group "containers" {
    count = 2

    task "api" {
      driver = "docker"

      config {
        image = "blazarcapital/chimp-api:1.0.0-beta.3"

        port_map {
          http = 3000
        }
      }

      resources {
        network {
          port "http" {}
        }
      }

      service {
        name = "chimp"
        port = "http"
        tags = ["public"]

        check {
          name = "health"
          path = "/"
          type = "http"
          interval = "10s"
          timeout = "3s"
        }
      }

      template {
        data = <<EOF
        {{ with secret "secret/data/mailchimp" }}
        MC_ACCOUNTS='{{ .Data.data.accounts | toJSON }}'
        {{ end }}
        EOF

        destination = "secrets/.env"
        env = true
      }

      vault {
        change_mode = "signal"
        change_signal = "SIGINT"
        policies = ["default", "nomad"]
      }
    }
  }
}
