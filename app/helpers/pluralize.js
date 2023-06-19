export default function pluralize(count, singular, plural) {
  if (count === 1) {
    return `${count} ${singular}`;
  } else {
    return `${count} ${plural}`;
  }
}
