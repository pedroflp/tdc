import { MatchTeamsEnum } from "../queue/types";

export const queueMoc = [
  {
    "id": "1234",
    "name": "Personalizada",
    "createdAt": "2024-04-24T13:51:28.920Z",
    "hoster": {
      "id": "12345",
      "name": "Gabes",
      "avatar": "https://img.freepik.com/fotos-gratis/estilo-de-anime-celebrando-o-dia-dos-namorados_23-2151258005.jpg",
    },
    "match": {
      "id": "223",
      "started": false,
      "finished": false,
      "teamWinner": MatchTeamsEnum.BLUE
    },
    "password": "123",
    "teams": {
      [MatchTeamsEnum.BLUE]: {
        "players": {
          "123": {
            "name": "Pedin",
            "score": 0,
          },
          "234": {
            "name": "Tieri",
            "score": 0,
          },
          "345": {
            "name": "Vanzo",
            "score": 0,
          },
          "4632": {
            "name": "Supreme",
            "score": 0,
          },
          "4634": {
            "name": "Gari",
            "score": 0,
          }
        }
      },
      [MatchTeamsEnum.RED]: {
          
      }
    },
    "players": {
      "123": {
          "name": "Pedin",
          "ready": true
      },
      "234": {
        "name": "Tieri",
        "avatar": "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Azir_0.jpg"
      },
      "345": {
          "name": "Vanzo"
      },
      "4632": {
        "name": "Supreme",
        "avatar": "https://rare-gallery.com/uploads/posts/208114-zed-league-of-legends-3840x2160.jpg"
      },
      "4634": {
          "name": "Gari"
      }
    }
  }
]