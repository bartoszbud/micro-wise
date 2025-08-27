package pl.lab.account.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "account" )
public class Account {

  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Integer id;
  private String email;
  private String nickname;
  private String firstName;
  private String lastName;
  private Integer age;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
