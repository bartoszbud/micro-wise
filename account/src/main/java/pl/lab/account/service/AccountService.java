package pl.lab.account.service;

import pl.lab.account.model.Account;
import pl.lab.account.repository.AccountRepository;
import pl.lab.account.dto.AccountSignupRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service layer is where all the business logic lies
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;

    public List<Account> getAllAccounts(){
        return accountRepository.findAll();
    }

    public Account getAccountById(Integer id){
        Optional<Account> optionalAccount = accountRepository.findById(id);
        if(optionalAccount.isPresent()){
            return optionalAccount.get();
        }
        log.info("Account with id: {} doesn't exist", id);
        return null;
    }

    public Account saveAccount (Account account){
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        Account savedAccount = accountRepository.save(account);

        log.info("Account with id: {} saved successfully", account.getId());
        return savedAccount;
    }

    public Account registerFromAuth(AccountSignupRequest request) {
        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setNickname(request.getName());
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());

        Account savedAccount = accountRepository.save(account);
        log.info("Account created from auth-service: nickname={}, email={}", account.getNickname(), account.getEmail());
        return savedAccount;
    }

    public Account updateAccount (Account account) {
        Optional<Account> existingAccount = accountRepository.findById(account.getId());
        account.setCreatedAt(existingAccount.get().getCreatedAt());
        account.setUpdatedAt(LocalDateTime.now());

        Account updatedAccount = accountRepository.save(account);

        log.info("Account with id: {} updated successfully", account.getId());
        return updatedAccount;
    }

    public void deleteAccountById (Integer id) {
        accountRepository.deleteById(id);
        log.info("Account with id: {} deleted successfully", id);
    }

}