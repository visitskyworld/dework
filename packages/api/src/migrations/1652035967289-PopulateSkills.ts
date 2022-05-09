import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateSkills1652035967289 implements MigrationInterface {
  private skills: { name: string; emoji: string }[] = [
    { name: "Development", emoji: "💻" },
    { name: "Design", emoji: "🎨" },
    { name: "Translation", emoji: "🌍" },
    { name: "Writing", emoji: "✍️" },
    { name: "Marketing", emoji: "📈" },
    { name: "Community", emoji: "🏘" },
    { name: "Product", emoji: "💎" },
    { name: "Research", emoji: "🔬" },
    { name: "Legal", emoji: "📚" },
    { name: "Operations", emoji: "⚙️" },
    { name: "Admin", emoji: "🔐" },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const skill of this.skills) {
      await queryRunner.query(`
        INSERT INTO skill ("name", "emoji", "sortKey")
        VALUES ('${skill.name}', '${skill.emoji}', '${Date.now()}')
      `);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
