import { saveItem, deleteItem } from '@/app/admin/actions';

// Used for both "add dish" and "edit dish".
export default function ItemForm({ item, categories, categoryId }) {
  const opts = (item?.options || []).map((o) => `${o.label} | ${o.price}`).join('\n');
  return (
    <form action={saveItem}>
      {item && <input type="hidden" name="id" value={item.id} />}
      {item?.image_url && <input type="hidden" name="image_url" value={item.image_url} />}
      <div className="grid2">
        <div className="field"><label>Name</label><input name="name" required defaultValue={item?.name} /></div>
        <div className="field"><label>Category</label>
          <select name="category_id" defaultValue={item?.category_id || categoryId}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      </div>
      <div className="field"><label>Description</label><textarea name="description" rows={2} defaultValue={item?.description || ''} /></div>
      <div className="grid2">
        <div className="field"><label>Price</label><input name="price" type="number" step="0.01" min="0" defaultValue={item?.price ?? ''} /><span className="hint">Leave empty if the dish has options below.</span></div>
        <div className="field"><label>Options (one per line)</label><textarea name="options" rows={3} placeholder={'Chicken | 14.99\nLamb/Goat | 15.99'} defaultValue={opts} /></div>
      </div>
      <div className="grid2">
        <div className="field"><label>Photo</label><input name="image" type="file" accept="image/*" />
          {item?.image_url && <label className="hint"><input type="checkbox" name="remove_image" /> Remove current photo</label>}</div>
        <div className="field"><label>Order on menu</label><input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} /></div>
      </div>
      <div className="checks">
        <label><input type="checkbox" name="available" defaultChecked={item ? item.available : true} /> Available</label>
        <label><input type="checkbox" name="vegetarian" defaultChecked={item?.vegetarian} /> Vegetarian</label>
        <label><input type="checkbox" name="featured" defaultChecked={item?.featured} /> Mark as popular</label>
      </div>
      <div className="row">
        <button className="btn sm">{item ? 'Save changes' : 'Add dish'}</button>
        {item && <button className="btn sm danger" formAction={deleteItem} formNoValidate>Delete dish</button>}
      </div>
    </form>
  );
}
