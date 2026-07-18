import React, { useEffect, useState } from "react";
import {
  getSchedule,
  saveSchedule,
} from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

const headerStyle = {};

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function loadSchedule() {
      const result = await getSchedule(getStoredEmail());

      if (result && result.length > 0) {
        setSchedule(result);
      } else {
        setSchedule([
          {
            address: "",
            from: 8,
            until: 20,
            days: [],
          },
        ]);
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
    await saveSchedule(getStoredEmail(), schedule);
    alert("Schedule saved.");
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "8px",
          color: "#222f68",
        }}
      >
        Weekly Schedule
      </h2>

      {schedule.length === 1 && schedule[0].address === "" && (
        <p
          style={{
            color: "#222f68",
            marginBottom: "30px",
            lineHeight: 1.6,
          }}
        >
          You haven't configured your schedule yet. Tell us where you usually
          are during the week so deliveries can be planned more efficiently.
        </p>
      )}

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
                  style={{
                    width: "95%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    fontSize: "14px",
                    outline: "none",
                    transition: "0.2s",
                  }}
                  value={row.address}
                  onChange={(e) => updateRow(index, "address", e.target.value)}
                />
              </td>

              <td style={{ padding: "16px" }}>
                <select
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    background: "#fff",
                    fontSize: "14px",
                  }}
                  value={row.from}
                  onChange={(e) =>
                    updateRow(index, "from", Number(e.target.value))
                  }
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
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d6d6d6",
                    background: "#fff",
                    fontSize: "14px",
                  }}
                  value={row.until}
                  onChange={(e) =>
                    updateRow(index, "until", Number(e.target.value))
                  }
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
                        transition: "0.2s",
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
