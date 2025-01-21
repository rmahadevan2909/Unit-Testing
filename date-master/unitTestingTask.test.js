const unitTestingTask = require("./unitTestingTask");

describe("unitTestingTask", () => {
  beforeAll(() => {
    unitTestingTask.lang("en"); // Set the time zone to UTC
  });
  const date = new Date("2025-01-08T05:09:03.07Z");

  test("should format date tokens to return full year", () => {
    expect(unitTestingTask("YYYY", date)).toBe("2025");
  });

  test("should format date tokens to return short year", () => {
    expect(unitTestingTask("YY", date)).toBe("25");
  });

  test("should format date tokens to return full month", () => {
    expect(unitTestingTask("MMMM", date)).toBe("January");
  });

  test("should format date tokens to return short month", () => {
    expect(unitTestingTask("MMM", date)).toBe("Jan");
  });

  test("should format date tokens to return month in number with zero", () => {
    expect(unitTestingTask("MM", date)).toBe("01");
  });

  test("should format date tokens to return month in number without zero", () => {
    expect(unitTestingTask("M", date)).toBe("1");
  });

  test("should format date tokens to return full day", () => {
    expect(unitTestingTask("DDD", date)).toBe("Wednesday");
  });

  test("should format date tokens to return short day", () => {
    expect(unitTestingTask("DD", date)).toBe("Wed");
  });

  test("should format date tokens to return shorter day", () => {
    expect(unitTestingTask("D", date)).toBe("We");
  });

  test("should format date tokens to return date with zero", () => {
    expect(unitTestingTask("dd", date)).toBe("08");
  });

  test("should format date tokens to return date without zero", () => {
    expect(unitTestingTask("d", date)).toBe("8");
  });

  test("should format date tokens to return date without zero", () => {
    expect(unitTestingTask("d", date)).toBe("8");
  });

  test("should format date tokens to return hour with zero", () => {
    expect(unitTestingTask("HH", date)).toBe("05");
  });

  test("should format date tokens to return hour without zero", () => {
    expect(unitTestingTask("H", date)).toBe("5");
  });

  test("should format date tokens to return hour with zero by passing hh", () => {
    expect(unitTestingTask("hh", date)).toBe("05");
  });

  test("should format date tokens to return hour without zero by passing h", () => {
    expect(unitTestingTask("h", date)).toBe("5");
  });

  test("should format date tokens to return minutes with zero", () => {
    expect(unitTestingTask("mm", date)).toBe("09");
  });

  test("should format date tokens to return minutes without zero", () => {
    expect(unitTestingTask("m", date)).toBe("9");
  });

  test("should format date tokens to return seconds with zero", () => {
    expect(unitTestingTask("ss", date)).toBe("03");
  });

  test("should formats date tokens to return seconds without zero", () => {
    expect(unitTestingTask("s", date)).toBe("3");
  });

  test("should format date tokens to return milliseconds with zero", () => {
    expect(unitTestingTask("ff", date)).toBe("070");
  });

  test("should format date tokens to return milliseconds without zero", () => {
    expect(unitTestingTask("f", date)).toBe("70");
  });

  test("should format date tokens to return time-zone in ISO8601-compatible basic format", () => {
    expect(unitTestingTask("ZZ", date)).toBe("+0000");
  });

  test("should format date tokens to return time-zone in ISO8601-compatible extended format", () => {
    expect(unitTestingTask("Z", date)).toBe("+00:00");
  });

  test("should format date tokens to return AM caps", () => {
    expect(unitTestingTask("A", date)).toBe("AM");
  });

  test("should format date tokens to return am small", () => {
    expect(unitTestingTask("a", date)).toBe("am");
  });

  test("should format date tokens to return PM caps", () => {
    const updatedDate = new Date("2025-01-17T13:09:03.456Z");
    expect(unitTestingTask("A", updatedDate)).toBe("PM");
  });

  test("should format date tokens to return pm small", () => {
    const updatedDate = new Date("2025-01-17T13:09:03.456Z");
    expect(unitTestingTask("a", updatedDate)).toBe("pm");
  });

  test("returns original string if no matching token", () => {
    const format = "No Token";
    const date1 = new Date("2025-01-17T05:09:03.456Z");
    expect(unitTestingTask(format, date1)).toBe(format);
  });

  test("should format time-zone offset to ISO8601-compatible basic format with negative offset and no separator", () => {
    const baseDate1 = new Date("2025-01-12T00:00:00Z"); // Mocked UTC time

    const utcOffsetMinutes = -300; // UTC-5
    const date = new Date(baseDate1.getTime() - utcOffsetMinutes * 60 * 1000);
    expect(unitTestingTask("ZZ", date, "")).toBe("+0000");
  });

  test("should handles unix timestamp date inputs", () => {
    expect(unitTestingTask("YYYY", 1735689600000)).toBe("2025"); // Unix timestamp
  });

  test("should handles ISO date string inputs", () => {
    expect(unitTestingTask("YYYY", "2025-01-17T05:09:03.456Z")).toBe("2025"); // ISO date string
  });

  describe("custom formats", () => {
    const date2 = new Date("2025-01-17T15:24:30.456Z");

    test("register and format custom formats", () => {
      unitTestingTask.register("customFormat", "YYYY/MM/dd");
      expect(unitTestingTask("customFormat", date2)).toBe("2025/01/17");
    });

    test("should format predefined ISO formats date", () => {
      expect(unitTestingTask("ISODate", date)).toBe("2025-01-08");
    });

    test("should format predefined ISO formats time", () => {
      expect(unitTestingTask("ISOTime", date)).toBe("05:09:03");
    });

    test("should format predefined ISO formats date time", () => {
      expect(unitTestingTask("ISODateTime", date)).toBe("2025-01-08T05:09:03");
    });

    test("should format predefined ISO formats date time with zone", () => {
      expect(unitTestingTask("ISODateTimeTZ", date)).toBe(
        "2025-01-08T05:09:03+00:00"
      );
    });
  });

  describe("error handling", () => {
    test("throws TypeError if format is not a string", () => {
      expect(() => unitTestingTask(123)).toThrow(TypeError);
    });

    test("throws TypeError if date is not a valid type", () => {
      expect(() => unitTestingTask("YYYY", {})).toThrow(TypeError);
    });
  });

  describe("language support", () => {
    test("sets and gets the current language", () => {
      expect(unitTestingTask.lang()).toBe("en");
      unitTestingTask.lang("fr", {
        _months:
          "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre".split(
            "_"
          ),
        months: function (date) {
          return this._months[date.getMonth()];
        },
        _monthsShort: "Jan_Fév_Mar_Avr_Mai_Jui_Juil_Aoû_Sep_Oct_Nov_Déc".split(
          "_"
        ),
        monthsShort: function (date) {
          return this._monthsShort[date.getMonth()];
        },
        weekdays: "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split(
          "_"
        ),
        weekdaysShort: "Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),
        weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
        meridiem: function (hours, isLower) {
          return hours > 11 ? (isLower ? "pm" : "PM") : isLower ? "am" : "AM";
        },
      });
      expect(unitTestingTask.lang()).toBe("fr");
      unitTestingTask.lang("en");
    });
  });

  describe("unitTestingTask.noConflict", () => {
    let originalUnitTestingTask;

    beforeAll(() => {
      // Save the original global unitTestingTask
      originalUnitTestingTask = global.unitTestingTask;
    });

    afterAll(() => {
      // Restore the original global unitTestingTask
      global.unitTestingTask = originalUnitTestingTask;
    });

    test("should restore the original unitTestingTask in the global namespace and return itself", () => {
      // Create a mock object to simulate a previous global unitTestingTask
      const mockPreviousUnitTestingTask = {
        name: "mockPreviousUnitTestingTask",
      };
      global.unitTestingTask = mockPreviousUnitTestingTask;
      const result = unitTestingTask.noConflict();

      expect(global.unitTestingTask).toBe(mockPreviousUnitTestingTask);
      expect(result).toBe(unitTestingTask);
    });
  });
});
