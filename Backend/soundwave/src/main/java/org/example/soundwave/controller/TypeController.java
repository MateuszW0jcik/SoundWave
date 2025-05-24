package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.TypeDTO;
import org.example.soundwave.model.request.TypeRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.service.TypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Type")
@RestController
@RequestMapping("/api/type")
@RequiredArgsConstructor
public class TypeController {
    private final TypeService typeService;

    @GetMapping("/all")
    public ResponseEntity<List<TypeDTO>> getAllTypes(){
        return ResponseEntity.ok(typeService.getAllTypes());
    }

    @GetMapping
    public ResponseEntity<PageResponse<TypeDTO>> getTypes(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @RequestParam(value = "name", defaultValue = "", required = false) String name) {
        return ResponseEntity.ok(typeService.getTypes(page, size, sortBy, sortDir, name));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addType(@Valid @RequestBody TypeRequest request) {
        typeService.addType(request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editType(@PathVariable Long id,
                                      @Valid @RequestBody TypeRequest request) {
        typeService.editType(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteType(@PathVariable Long id) {
        typeService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
}
