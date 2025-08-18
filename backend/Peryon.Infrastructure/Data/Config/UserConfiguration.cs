using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Peryon.Core.Entities;

namespace Peryon.Infrastructure.Data.Config;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(ColumnConstants.DEFAULT_NAME_LENGTH);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.OwnsOne(u => u.Name, nameBuilder =>
        {
            nameBuilder.Property(n => n.First)
                .HasColumnName("FirstName")
                .HasMaxLength(ColumnConstants.DEFAULT_NAME_LENGTH)
                .IsRequired();

            nameBuilder.Property(n => n.Last)
                .HasColumnName("LastName")
                .HasMaxLength(ColumnConstants.DEFAULT_NAME_LENGTH)
                .IsRequired();
        });

        builder.Property(u => u.AthleteId)
            .IsRequired();
    }
}