let user = { email: "" };

let configurations = {
  returnTimeObject: { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 },
  popupBodyMainColor: "Yellow",
  deadline: () =>
    new Date(
      new Date().setHours(...Object.values(configurations.returnTimeObject))
    ),
  popupBodySecondaryColor: "Green",
  timeUpBadgeColor: "Red",
  warningBadgeColor: "Orange",
  introNotification: {
    name: "intro",
    options: {
      type: "basic",
      priority: 2,
      requireInteraction: true,
      iconUrl: "images/48.png",
      title: "Chromebook Loaner Reminder",
      message: `Hi ${user.email}! You borrowed this Chromebook and you are responsible to return this on time!`,
      contextMessage:
        "Remember to return this Chromebook on time to the tech office or else you will get into trouble.",
    },
  },
  hourNotification: {
    name: "half-time",
    options: {
      type: "basic",
      priority: 2,
      requireInteraction: true,
      iconUrl: "images/48.png",
      title: "You have an hour to return Chromebook",
      message: `Quick reminder to please turn in your Chromebook within an hour`,
      contextMessage:
        "Remember to return your Chromebook before the deadline date or get in trouble",
    },
  },
  halfHourNotification: {
    name: "half-Hour",
    options: {
      type: "basic",
      priority: 2,
      requireInteraction: true,
      iconUrl: "images/48.png",
      title: "You have half an hour to return Chromebook",
      message: `Hi! You have an hour to return Chromebook`,
      contextMessage:
        "Remember to return your Chromebook before the deadline date or get in trouble",
    },
  },
  lastNotification: {
    name: "last",
    options: {
      type: "basic",
      priority: 2,
      requireInteraction: true,
      iconUrl: "images/48.png",
      title: "Last Reminder",
      message: `Return this Chromebook immediately or else you will get into trouble!`,
      contextMessage:
        "Return this chromebook immediately or else you will get in trouble!",
    },
  },
};

export { configurations, user };
