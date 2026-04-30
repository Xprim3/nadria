import { copyOpeningHoursToWeek, updateOpeningHour } from "@/app/admin/actions";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getOpeningHours } from "@/lib/admin/data";
import { weekdayLabel } from "@/lib/format";

export const metadata = { title: "Hours" };
export const dynamic = "force-dynamic";

export default async function AdminHoursPage() {
  const { hours } = await getOpeningHours();
  const byDay = new Map(hours.map((hour) => [hour.day_of_week, hour]));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Schedule"
        title="Opening hours"
        description="Set lunch and evening opening times for each day. Mark closed days clearly for customers."
      />

      <AdminPanel title="Weekly schedule">
        <form
          action={copyOpeningHoursToWeek}
          className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4"
        >
          <Field label="Copy from day">
            <select name="source_day" className={inputClass} defaultValue="1">
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <option key={day} value={day}>
                  {weekdayLabel(day)}
                </option>
              ))}
            </select>
          </Field>
          <SubmitButton variant="secondary" className="border-amber-300 bg-amber-100 text-amber-950 hover:border-amber-400 hover:bg-amber-200">
            Copy selected day to Tue-Sun
          </SubmitButton>
        </form>
        <div className="grid gap-4">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const row = byDay.get(day);
            return (
              <form
                key={day}
                action={updateOpeningHour}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <input type="hidden" name="day_of_week" value={day} />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] md:items-end">
                  <div>
                    <p className="text-sm font-semibold text-stone-950">
                      {weekdayLabel(day)}
                    </p>
                    <label className="mt-2 flex items-center gap-2 text-sm text-stone-700">
                      <input
                        name="is_closed"
                        type="checkbox"
                        defaultChecked={row?.is_closed ?? false}
                      />
                      Closed
                    </label>
                  </div>
                  <Field label="Opens 1">
                    <input
                      className={inputClass}
                      name="open_time"
                      type="time"
                      defaultValue={row?.open_time?.slice(0, 5) ?? ""}
                    />
                  </Field>
                  <Field label="Closes 1">
                    <input
                      className={inputClass}
                      name="close_time"
                      type="time"
                      defaultValue={row?.close_time?.slice(0, 5) ?? ""}
                    />
                  </Field>
                  <Field label="Opens 2">
                    <input
                      className={inputClass}
                      name="second_open_time"
                      type="time"
                      defaultValue={row?.second_open_time?.slice(0, 5) ?? ""}
                    />
                  </Field>
                  <Field label="Closes 2">
                    <input
                      className={inputClass}
                      name="second_close_time"
                      type="time"
                      defaultValue={row?.second_close_time?.slice(0, 5) ?? ""}
                    />
                  </Field>
                  <SubmitButton variant="secondary">Save</SubmitButton>
                </div>
              </form>
            );
          })}
        </div>
      </AdminPanel>
    </div>
  );
}
