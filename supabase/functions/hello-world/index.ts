import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0"

console.log("Hello from Functions!")

export interface Testtype {
  meta: Meta
  data: Data
}

export interface Data {
  type: string
  id: string
  attributes: Attributes
  relationships: Relationships
  links: DataLinks
}

export interface Attributes {
  store_id: number
  identifier: string
  order_number: number
  user_name: string
  user_email: string
  currency: string
  currency_rate: string
  subtotal: number
  discount_total: number
  tax: number
  total: number
  subtotal_usd: number
  discount_total_usd: number
  tax_usd: number
  total_usd: number
  tax_name: string
  tax_rate: string
  status: string
  status_formatted: string
  refunded: null
  refunded_at: null
  subtotal_formatted: string
  discount_total_formatted: string
  tax_formatted: string
  total_formatted: string
  first_order_item: FirstOrderItem
  created_at: string
  updated_at: string
  test_mode: boolean
}

export interface FirstOrderItem {
  order_id: number
  product_id: number
  variant_id: number
  product_name: string
  variant_name: string
  price: number
  created_at: string
  updated_at: string
  test_mode: boolean
}

export interface DataLinks {
  self: string
}

export interface Relationships {
  store: LicenseKeys
  "order-items": LicenseKeys
  subscriptions: LicenseKeys
  "license-keys": LicenseKeys
}

export interface LicenseKeys {
  links: LicenseKeysLinks
}

export interface LicenseKeysLinks {
  related: string
  self: string
}

export interface Meta {
  event_name: string
  custom_data?: any
}

serve(async (req) => {
  const body = (await req.json()) as Testtype

  if (!body.meta.custom_data) {
    return new Response(JSON.stringify({ error: "No custom data" }), {
      headers: { "Content-Type": "application/json" },
    })
  }
  const userId = body.meta.custom_data.user_id

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  const { data, error } = await supabaseClient
    .from("profiles")
    .update({ subscription_status: true })
    .eq("id", userId)

  console.log(data, error)

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  })
})
