import "./EditForm.css";

function EditForm({
    anuncio = {},
    form = {},
    onChange = () => {},
    onSubmit = (e) => e.preventDefault()
}) {

    return (

        <form
            className="edit-form"
            onSubmit={onSubmit}
        >

            <h2>📝 Informações do anúncio</h2>

            <div className="form-group">

                <label>Título</label>

                <input
                    type="text"
                    name="titulo"
                    value={form.titulo ?? anuncio.titulo ?? ""}
                    onChange={onChange}
                    placeholder="Título do anúncio"
                />

            </div>

            <div className="form-group">

                <label>Descrição</label>

                <textarea
                    name="descricao"
                    rows={6}
                    value={form.descricao ?? anuncio.descricao ?? ""}
                    onChange={onChange}
                    placeholder="Descrição do anúncio"
                />

            </div>

            <div className="form-grid">

                <div className="form-group">

                    <label>Preço</label>

                    <input
                        type="number"
                        name="preco"
                        value={form.preco ?? anuncio.preco ?? ""}
                        onChange={onChange}
                    />

                </div>

                <div className="form-group">

                    <label>Categoria</label>

                    <input
                        type="text"
                        name="categoria"
                        value={form.categoria ?? anuncio.categoria ?? ""}
                        onChange={onChange}
                    />

                </div>

            </div>

            <div className="form-group">

                <label>Localização</label>

                <input
                    type="text"
                    name="localizacao"
                    value={form.localizacao ?? anuncio.localizacao ?? ""}
                    onChange={onChange}
                />

            </div>

            <button
                type="submit"
                className="save-button"
            >

                💾 Salvar Alterações

            </button>

        </form>

    );

}

export default EditForm;