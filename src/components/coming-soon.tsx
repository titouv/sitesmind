const comingSoonList = [
  "Choose your start phrase",
  "Customize the interface of the embed",
  "select the root of the website you want to import, and import all the subpages at once",
  "Import data from file like CSV of PDF",
  "Choose a language for the bot",
];

export function ComingSoon() {
  return (
    <div className="prose prose-sm my-4">
      <h3>Coming Soon</h3>
      <ul>
        {comingSoonList.map((item, pos) => (
          <li key={pos}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
