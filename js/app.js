document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GUARDAR CONTACTO (vCard 3.0 Universal)
    // ==========================================
    const btnSaveContact = document.getElementById('btnSaveContact');

    if (btnSaveContact) {
        btnSaveContact.addEventListener('click', (e) => {
            e.preventDefault();

            // Datos centralizados del Dr. Rogelio Carranza
            const contactData = {
                name: "Dr. Rogelio Carranza",
                phone: "+528111576796",
                company: "Terapia Celular Nanotecnología",
                title: "Asesor Médico de Siniestros Gastos Médicos",
                street: "Ruperto Martínez 1235",
                city: "Monterrey",
                state: "Nuevo León",
                zip: "64000",
                country: "México",
                url: window.location.href,
                mapsUrl: "https://maps.app.goo.gl/aGuRnTpVSEsGXrcTA"
            };

            // Estructura vCard 3.0 estándar (utiliza CRLF \r\n para compatibilidad estricta)
            const vCardString = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Carranza;Rogelio;;Dr.;',
                `FN:${contactData.name}`,
                `ORG:${contactData.company}`,
                `TITLE:${contactData.title}`,
                `TEL;TYPE=WORK,VOICE:${contactData.phone}`,
                `TEL;TYPE=CELL,VOICE:${contactData.phone}`,
                `ADR;TYPE=WORK:;;${contactData.street};${contactData.city};${contactData.state};${contactData.zip};${contactData.country}`,
                `URL:${contactData.url}`,
                `NOTE:Ubicación Google Maps: ${contactData.mapsUrl}`,
                'END:VCARD'
            ].join('\r\n');

            // Detección de Android
            const isAndroid = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);

            if (isAndroid) {
                // TÉCNICA ANDROID: Data URI codificada en UTF-8 para disparar la app de contactos nativa
                const dataUri = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCardString);

                const link = document.createElement('a');
                link.href = dataUri;
                link.setAttribute('download', 'Dr_Rogelio_Carranza.vcf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // TÉCNICA iOS / WINDOWS / MAC: Blob + Object URL
                const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Dr_Rogelio_Carranza.vcf');
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                setTimeout(() => window.URL.revokeObjectURL(url), 200);
            }
        });
    }

    // ==========================================
    // 2. COMPARTIR PERFIL (Web Share API)
    // ==========================================
    const btnShare = document.getElementById('btnShare');

    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareData = {
                title: 'Dr. Rogelio Carranza | BVCard',
                text: 'Te comparto la tarjeta digital del Dr. Rogelio Carranza.',
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback para navegadores de escritorio que no soportan la Web Share API
                    await navigator.clipboard.writeText(window.location.href);
                    alert('¡Enlace de la tarjeta copiado al portapapeles!');
                }
            } catch (err) {
                // Previene registrar errores en consola si el usuario cancela la ventana de compartir
                if (err.name !== 'AbortError') {
                    console.error('Error al compartir:', err);
                }
            }
        });
    }

});
