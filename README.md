# Simple Yu Gi Oh! Deck Browser

### Η ανάπτυξη της εφαρμογής
 Η συγκεκριμένη εφαρμογή αποτελεί μια παραλλαγή της παρακάτω ήδη υπαρχούσης:

*  [Simple Yu Gi Oh! Deck Browser](https://github.com/thanostath13/yugi/ "Simple Yu Gi Oh! Deck Browser")

Σε αυτή την περίπτωση η local Storage έχει αντικατασταθεί με μια σε φυσική βάση δεδομένων MySQL. Επιλέξαμε να αποθηκεύουμε τα δεδομένα μας σε έναν πινάκα με δυο στήλες, μια που κρατάμε ένα μοναδικό id κάθε χρηστή και μια που περιέχει τα δεδομένα της συλλογής καρτών του. Έχουν προστεθεί ακόμα δυο αρχεία PHP ( Rest.inc.php, simpleapi.php ) μέσα στα όποια βρίσκεται και το αντίστοιχο reference ώστε να δημιουργηθεί το MySQL Rest API. Έχει επιλεγεί μια απλή υλοποίηση η όποια όμως καλύπτει τις ανάγκες της συγκεκριμένης εφαρμογής. Ο πινάκας που επιλέχτηκε να χρησιμοποιηθεί μας προσφέρει μια εύκολη πρόσβαση στην συλλογή του χρηστή χωρίς να αλλάξει η ήδη υπάρχουσα υλοποίηση. Μέσα στον κώδικα υπάρχουν αντίστοιχα σχόλια με τα κομμάτια τα όποια έχουν αλλάξει η προστεθεί αντίστοιχα.
***
