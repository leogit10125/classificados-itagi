import { getImageUrl } from "../../../utils/imageUrl";

function GalleryManager({ anuncio, onFilesChange }) {

    if (!anuncio) return null;

    return (
        <section className="gallery-manager">

            <h2>📷 Imagens</h2>

            <div className="gallery-grid">

                {(anuncio.imagens || []).map((img, index) => (

                    <div key={index} className="gallery-item">

                        <img
                            src={getImageUrl(img)}
                            alt={`Imagem ${index + 1}`}
                        />

                    </div>

                ))}

            </div>

            <label className="upload-box">

                ➕ Adicionar imagens

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        if (onFilesChange) {
                            onFilesChange(e.target.files);
                        }
                    }}
                    hidden
                />

            </label>

        </section>
    );
}

export default GalleryManager;