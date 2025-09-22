import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format: (date, formatString, options) => {
    // Check if the formatString is meant for displaying days (used in the header)
    if (formatString === "weekdayFormat") {
      return format(date, "EEEE", options); // Show full day names like "Monday"
    }
    return format(date, formatString, options);
  },

  parse: (value, formatString, options) =>
    parse(value, formatString, new Date(), options),

  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Week starts on Monday

  getDay,
  locales,
});

export default localizer;
