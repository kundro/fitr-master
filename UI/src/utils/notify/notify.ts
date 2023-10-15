import { ReactNotificationOptions, store } from "react-notifications-component";
import "animate.css/animate.compat.css";
import "react-notifications-component/dist/scss/notification.scss";
import "./notify.scss";

function getOptions(
  message: string,
  type: "danger" | "success" | "info" | "default" | "warning"
): ReactNotificationOptions {
  return {
    message: message,
    type: type,
    insert: "bottom",
    container: "bottom-center",
    // slidingEnter: {
    //   delay: 0,
    //   timingFunction: "ease",
    //   duration: 500,
    // },
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    slidingExit: {
      delay: 0,
      timingFunction: "ease",
      duration: 500,
    },
    dismiss: {
      duration: 4000,
      pauseOnHover: true,
      onScreen: true,
      showIcon: true,
    },
  };
}

export function notifyDanger(message: string) {
  // store.addNotification(getOptions(message, "danger"));
}

export function notifySuccess(message: string) {
  // store.addNotification(getOptions(message, "success"));
}
