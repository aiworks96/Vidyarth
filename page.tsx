import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, exam, class, subject, price, discount_price, pages")
    .eq("is_published", true)
    .eq("is_featured", true)
    .limit(8);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-1">Study Smarter. Prepare Better. Score Higher.</h1>
      <p className="text-sm text-ink/60 mb-8">
        Exam-focused digital notes, PYQs and question banks for CBSE, NEET and UPSC.
      </p>

      {error && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 mb-8">
          Couldn't load products from Supabase yet: <code>{error.message}</code>. Make sure the
          migrations in <code>supabase/migrations</code> have been run and at least one row exists
          in <code>products</code> with <code>is_published = true</code>.
        </div>
      )}

      {!error && (!products || products.length === 0) && (
        <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-ink/60 mb-8">
          No published products yet. Insert a row into <code>public.products</code> (via the
          Supabase table editor or the admin dashboard once it's built) to see it appear here.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products?.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="rounded-2xl border border-black/10 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink/50">
              {p.exam}
              {p.class ? ` · ${p.class}` : ""}
            </p>
            <h3 className="font-medium mt-1">{p.title}</h3>
            <p className="text-xs text-ink/50 mt-1">{p.subject} · {p.pages} pages</p>
            <p className="mt-3 font-semibold">
              ₹{p.discount_price ?? p.price}
              {p.discount_price && (
                <span className="text-xs line-through text-ink/40 ml-2">₹{p.price}</span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
