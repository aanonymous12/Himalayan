import ItemForm from '@/components/admin/ItemForm';
import { requireAdmin } from '@/lib/auth';
import { money } from '@/lib/format';
import { saveCategory, deleteCategory, toggleAvailable } from '../actions';

export default async function AdminMenu() {
  const { sb } = await requireAdmin();
  const [{ data: catsData }, { data: itemsData }] = await Promise.all([
    sb.from('menu_categories').select('*').order('sort_order'),
    sb.from('menu_items').select('*').order('sort_order'),
  ]);
  const cats = catsData ?? [], items = itemsData ?? [];
  const priceText = (i) => (i.options?.length ? i.options.map((o) => `${o.label} ${money(o.price)}`).join(', ') : money(i.price));

  return (
    <>
      <h1 style={{ marginBottom: '.5rem' }}>Menu</h1>
      <p className="muted">Changes show on the public menu right away. Use &ldquo;Sold out&rdquo; for the day instead of deleting.</p>

      <details className="edit" style={{ margin: '1.25rem 0 2rem' }}>
        <summary><b>Add a category</b></summary>
        <form action={saveCategory}>
          <div className="grid2">
            <div className="field"><label>Name</label><input name="name" required /></div>
            <div className="field"><label>Order on menu</label><input name="sort_order" type="number" defaultValue={cats.length + 1} /></div>
          </div>
          <div className="field"><label>Short note (optional)</label><input name="description" /></div>
          <button className="btn sm">Add category</button>
        </form>
      </details>

      {cats.map((c) => (
        <section key={c.id} style={{ marginBottom: '2.5rem' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.4rem' }}>{c.name} {!c.visible && <span className="muted">(hidden)</span>}</h2>
          </div>
          <details className="edit">
            <summary>Edit category</summary>
            <form action={saveCategory}>
              <input type="hidden" name="id" value={c.id} />
              <div className="grid2">
                <div className="field"><label>Name</label><input name="name" required defaultValue={c.name} /></div>
                <div className="field"><label>Order on menu</label><input name="sort_order" type="number" defaultValue={c.sort_order} /></div>
              </div>
              <div className="field"><label>Short note</label><input name="description" defaultValue={c.description || ''} /></div>
              <div className="checks"><label><input type="checkbox" name="visible" defaultChecked={c.visible} /> Show on website</label></div>
              <div className="row"><button className="btn sm">Save category</button>
                <button className="btn sm danger" formAction={deleteCategory} formNoValidate>Delete category and its dishes</button></div>
            </form>
          </details>
          {items.filter((i) => i.category_id === c.id).map((i) => (
            <details className="edit" key={i.id}>
              <summary>
                <span>{i.name} {!i.available && <span className="soldout">sold out</span>}</span>
                <span className="muted">{priceText(i)}</span>
              </summary>
              <div style={{ padding: '0 .9rem' }}>
                <form action={toggleAvailable} style={{ padding: 0, marginBottom: '.75rem' }}>
                  <input type="hidden" name="id" value={i.id} /><input type="hidden" name="available" value={String(i.available)} />
                  <button className="btn sm line">{i.available ? 'Mark sold out' : 'Mark available again'}</button>
                </form>
              </div>
              <ItemForm item={i} categories={cats} />
            </details>
          ))}
          <details className="edit">
            <summary><b>Add a dish to {c.name}</b></summary>
            <ItemForm categories={cats} categoryId={c.id} />
          </details>
        </section>
      ))}
    </>
  );
}
