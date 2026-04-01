import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import type { GoalSettingKey } from "@/lib/domain";

export async function getNumericSetting(key: GoalSettingKey): Promise<number | null> {
  const result = await db
    .select({ value: userSettings.value })
    .from(userSettings)
    .where(eq(userSettings.key, key))
    .limit(1);

  return result[0] ? Number(result[0].value) : null;
}

export async function getNumericSettings<TKeys extends readonly GoalSettingKey[]>(
  keys: TKeys
): Promise<Record<TKeys[number], number | null>> {
  const rows = await db
    .select({
      key: userSettings.key,
      value: userSettings.value,
    })
    .from(userSettings)
    .where(inArray(userSettings.key, [...keys]));

  const byKey = new Map(rows.map((row) => [row.key, Number(row.value)]));

  return keys.reduce(
    (acc, key) => {
      acc[key as TKeys[number]] = byKey.get(key) ?? null;
      return acc;
    },
    {} as Record<TKeys[number], number | null>
  );
}

export async function upsertNumericSetting(key: GoalSettingKey, value: number) {
  const existing = await db
    .select({ id: userSettings.id })
    .from(userSettings)
    .where(eq(userSettings.key, key))
    .limit(1);

  if (existing[0]) {
    await db
      .update(userSettings)
      .set({ value: String(value) })
      .where(eq(userSettings.key, key));
    return;
  }

  await db.insert(userSettings).values({ key, value: String(value) });
}
