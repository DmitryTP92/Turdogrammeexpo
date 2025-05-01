// constants.js

import i18n from "./i18n";

export const TURD_GIF_LIST = [
  {
    key: "happy",
    label: i18n.t("turd.happy", { defaultValue: "Happy Turd" }),
    gif: "https://i.postimg.cc/L4jBdgtR/Happy-Turd.gif",
    cost: 0,
    png: require("./assets/Happy_Turd.png")
  },
  {
    key: "angry",
    label: i18n.t("turd.angry", { defaultValue: "Angry Turd" }),
    gif: "https://i.postimg.cc/WbP8twNh/Angry-Turd.gif",
    cost: 0,
    png: require("./assets/Angry_Turd.png")
  },
  {
    key: "exploding",
    label: i18n.t("turd.exploding", { defaultValue: "Exploding Turd" }),
    gif: "https://i.postimg.cc/JzrQ57B8/Exploding-Turd.gif",
    cost: 20,
    png: require("./assets/Exploding_Turd.png")
  },
  {
    key: "unicorn",
    label: i18n.t("turd.unicorn", { defaultValue: "Unicorn Turd" }),
    gif: "https://i.postimg.cc/1X0pDbm4/Unicorn-Turd.gif",
    cost: 20,
    png: require("./assets/Unicorn_Turd.png")
  },
  {
    key: "golden",
    label: i18n.t("turd.golden", { defaultValue: "Golden Turd" }),
    gif: "https://i.postimg.cc/mDH3gtKY/Golden-Turd.gif",
    cost: 25,
    png: require("./assets/Golden_Turd.png")
  }
];

export const BUY_COINS_BUTTON = {
  label: i18n.t("turd.buy", { defaultValue: "Buy More TurdCoins 💰" }),
  png: require("./assets/TurdCoins_purchase.gif")
};
