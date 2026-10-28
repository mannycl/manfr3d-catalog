export function whatsappUrl(message: string) {
  const number = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
  if (!number) return '#';
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
