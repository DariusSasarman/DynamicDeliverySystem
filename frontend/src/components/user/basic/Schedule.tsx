import React, { useEffect, useState } from "react";
import {
  getSchedule,
  saveSchedule,
} from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function loadSchedule() {
      const result = await getSchedule(getStoredEmail());

      if (result) {
        // Supports both:
        // { phoneNumber, schedule }
        // or just an array (older API)
        if (Array.isArray(result)) {
          setSchedule(
            result.length > 0
              ? result
              : [
                  {
                    address: "",
                    from: 8,
                    until: 20,
                    days: [],
                  },
                ]
          );
        } else {
          setPhoneNumber(result.phoneNumber ?? "");

          setSchedule(
            result.schedule && result.schedule.length > 0
              ? result.schedule
              : [
                  {
                    address: "",
                    from: 8,
                    until: 20,
                    days: [],
                  },
                ]
          );
        }
      }
    }

    loadSchedule();
  }, []);

  function updateRow(index, key, value) {
    const copy = [...schedule];
    copy[index][key] = value;
    setSchedule(copy);
  }

  function toggleDay(row, day) {
    const copy = [...schedule];

    if (copy[row].days.includes(day)) {
      copy[row].days = copy[row].days.filter((d) => d !== day);
    } else {
      copy[row].days.push(day);
    }

    setSchedule(copy);
  }

  function addRow() {
    setSchedule([
      ...schedule,
      {
        address: "",
        from: 8,
        until: 20,
        days: [],
      },
    ]);
  }

  async function handleSave() {
    await saveSchedule(getStoredEmail(), {
      phoneNumber,
      schedule,
    });

    alert("Schedule saved.");
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        marginTop : "110px",
        padding: "30px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {schedule.length === 1 && schedule[0].address === "" && (
        <p
          style={{
            color: "#222f68",
            marginBottom: "25px",
            lineHeight: 1.6,
          }}
        >
          You haven't configured your schedule yet. Tell us where you usually
          are during the week so deliveries can be planned more efficiently.
        </p>
      )}

      <div
        style={{
          marginBottom: "30px",
          maxWidth: "420px",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#222f68",
          }}
        >
          Contact Phone Number
        </label>

        <input
          type="tel"
          placeholder="+40 7xx xxx xxx"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d6d6d6",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <p
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Couriers may use this number if they need to contact you regarding a
          delivery.
        </p>
      </div>
      <h2
        style={{
          marginBottom: "8px",
          color: "#222f68",
        }}
      >
        Weekly Schedule
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 14px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "14px",
                color: "#222f68",
                fontWeight: "600",
                borderBottom: "2px solid #ececec",
              }}
            >
              Address
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px",
                color: "#222f68",
                fontWeight: "600",
                borderBottom: "2px solid #ececec",
              }}
            >
              From
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px",
                color: "#222f68",
                fontWeight: "600",
                borderBottom: "2px solid #ececec",
              }}
            >
              Until
            </th>

            <th
              style={{
                textAlign: "left",
                padding: "14px",
                color: "#222f68",
                fontWeight: "600",
                borderBottom: "2px solid #ececec",
              }}
            >
              Days of the Week
            </th>
          </tr>
        </thead>

        <tbody>
          {schedule.map((row, index) => (
            <tr
              key={index}
              style={{
                background: "#fafafa",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <td
                style={{
                  padding: "16px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                <input
                  value={row.address}
                  onChange={(e) =>
                    updateRow(index, "address", e.target.value)
                  }
                  style={{
                    width: "95%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </td>

              <td style={{ padding: "16px" }}>
                <select
                  value={row.from}
                  onChange={(e) =>
                    updateRow(index, "from", Number(e.target.value))
                  }
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    fontSize: "14px",
                  }}
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </td>

              <td style={{ padding: "16px" }}>
                <select
                  value={row.until}
                  onChange={(e) =>
                    updateRow(index, "until", Number(e.target.value))
                  }
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    fontSize: "14px",
                  }}
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </td>

              <td
                style={{
                  padding: "16px",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {DAYS.map((day) => (
                    <label
                      key={day}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        background: row.days.includes(day)
                          ? "#dbeafe"
                          : "#f2f2f2",
                        cursor: "pointer",
                        userSelect: "none",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={row.days.includes(day)}
                        onChange={() => toggleDay(index, day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <button onClick={addRow}>Add Address</button>

        <button
          style={{
            marginLeft: "10px",
          }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}