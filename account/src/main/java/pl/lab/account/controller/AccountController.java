package pl.lab.account.controller;

import pl.lab.account.model.Account;
import pl.lab.account.service.AccountService;
import pl.lab.account.dto.AccountSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping(path="/account")
@CrossOrigin(origins = "*")
public class AccountController {
    
    private final AccountService accountService;

    @PostMapping(path="/add")
    //public @ResponseBody String addNewUser (@RequestParam String firstName, @RequestParam String lastName) {
    public ResponseEntity<Account> saveAccount(@RequestBody Account account) {
        return ResponseEntity.ok().body(accountService.saveAccount(account));
    }

    @PostMapping("/signup")
        public ResponseEntity<Account> addAccountFromAuth(@RequestBody AccountSignupRequest request) {
        Account savedAccount = accountService.registerFromAuth(request);
        return ResponseEntity.ok(savedAccount);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Account>> getAllAccounts(){
        return ResponseEntity.ok().body(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Integer id)
    {
        return ResponseEntity.ok().body(accountService.getAccountById(id));
    }

    @PutMapping("/")
    public ResponseEntity<Account> updateAccount(@RequestBody Account account)
    {
        return ResponseEntity.ok().body(accountService.updateAccount(account));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccountById(@PathVariable Integer id)
    {
        accountService.deleteAccountById(id);
        return ResponseEntity.ok().body("Deleted account successfully");
    }

}
