# Evidence viewer

Owns the `EvidenceRecord` display contract and `EvidencePanel` attribution view.
The record retains evidence identity, provider record, observation time, source URL
and inference status. Only HTTP(S) source links become clickable; external links
are named and open with opener isolation.

Composition passes the selected paper or citation attribution from the explorer.
The viewer does not import the explorer or transport models.
