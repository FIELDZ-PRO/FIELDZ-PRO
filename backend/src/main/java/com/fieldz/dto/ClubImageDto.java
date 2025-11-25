package com.fieldz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubImageDto {
    private Long id;
    private String imageUrl;
    private Integer displayOrder;
}
